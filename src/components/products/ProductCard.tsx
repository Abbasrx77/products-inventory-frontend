import { useState } from "react"
import {
	Card,
	CardContent,
	CardActions,
	Typography,
	IconButton,
	Box,
	Rating,
	Chip,
	Button,
} from "@mui/material"
import { Product } from "../../types/product"

interface ProductCardProps {
	product: Product
	onEdit: (product: Product) => void
	onDelete: (id: string) => void
}

export const ProductCard = ({
	product,
	onEdit,
	onDelete,
}: ProductCardProps) => {
	const [isHovered, setIsHovered] = useState(false)
	const warrantyText = product.warranty_years === 1 ? "an" : "ans"

	return (
		<Card
			sx={{
				height: "100%",
				display: "flex",
				flexDirection: "column",
				position: "relative",
				overflow: "visible",
				"&::before": {
					content: '""',
					position: "absolute",
					top: 0,
					left: 0,
					right: 0,
					height: "4px",
					background: "linear-gradient(90deg, primary.main, primary.light)",
					borderTopLeftRadius: "12px",
					borderTopRightRadius: "12px",
				},
			}}
			onMouseEnter={() => setIsHovered(true)}
			onMouseLeave={() => setIsHovered(false)}
		>
			<CardContent sx={{ flexGrow: 1, pt: 3 }}>
				<Typography variant="h6" gutterBottom fontWeight="600">
					{product.name}
				</Typography>
				<Typography
					variant="body2"
					color="text.secondary"
					sx={{
						mb: 2,
						textTransform: "uppercase",
						letterSpacing: "0.05em",
						fontSize: "0.75rem",
					}}
				>
					{product.type}
				</Typography>
				<Box sx={{ display: "flex", gap: 1, mb: 2 }}>
					<Chip
						label={`${product.warranty_years} ${warrantyText} de garantie`}
						size="small"
						color="info"
						variant="outlined"
					/>
					<Chip
						label={product.available ? "Disponible" : "Indisponible"}
						size="small"
						color={product.available ? "success" : "error"}
						variant="outlined"
					/>
				</Box>
				<Rating
					value={product.rating}
					readOnly
					precision={0.5}
					sx={{ mb: 2 }}
				/>
				<Typography
					variant="h5"
					color="primary"
					fontWeight="600"
					sx={{ mb: 2 }}
				>
					{product.price.toLocaleString("fr-FR", {
						style: "currency",
						currency: "EUR",
					})}
				</Typography>
			</CardContent>
			<CardActions sx={{ justifyContent: "flex-end", p: 2, pt: 0 }}>
				<Button
					size="small"
					onClick={() => onEdit(product)}
					sx={{
						mr: 1,
						backgroundColor: "background.paper",
						"&:hover": { backgroundColor: "grey.100" },
					}}
				>
					Modifier
				</Button>
				<Button
					size="small"
					color="error"
					onClick={() => product.id && onDelete(product.id)}
					sx={{
						backgroundColor: "error.light",
						color: "white",
						"&:hover": { backgroundColor: "error.main" },
					}}
				>
					Supprimer
				</Button>
			</CardActions>
		</Card>
	)
}
